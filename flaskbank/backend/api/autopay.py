from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.jobstores.mongodb import MongoDBJobStore
from .. import mongo
from .. import all_module as am
from .utils import deposit, withdraw
from datetime import datetime

autopay_bp = am.Blueprint('autopay', __name__)

scheduler = BackgroundScheduler(
    jobstores={'mongo': MongoDBJobStore(client=mongo.cx)})


def add_autopay(client, from_acc, to_acc, amount):
    if not withdraw(client, from_acc, amount, f'autopay to {to_acc[-4:]}') or \
            not deposit(client, to_acc, amount,
                        f'autopay from {from_acc[-4:]}'):
        print('autopay failed', datetime.now())
        return
    print('autopay success', datetime.now())


@autopay_bp.route('/autopay', methods=['POST'])
@am.jwt_required
def autopay_route():
    current_user = am.get_jwt_identity()['username']
    data = am.request.get_json()
    try:
        from_acc = data['from']
        to_acc = data['to']
        amount = data['amount']
        interval = data['interval']
    except KeyError:
        return am.jsonify({'msg': 'missing/misspelled key'}), 400
    if not am.verify(from_acc) or not am.verify(to_acc):
        return am.jsonify({'msg': 'invalid account number'})

    job_name = f'autopay {amount:.2f} from {from_acc} to {to_acc} at ' \
        f'{interval} interval'

    job = scheduler.add_job(add_autopay, 'interval', minutes=interval,
                            name=job_name,
                            jobstore='mongo',
                            args=(current_user, from_acc, to_acc, amount),
                            replace_existing=True)
    print(job.name, job.id)
    am.clients.update_one(
        {'username': current_user},
        {'$push': {'auto_pay': {
            'job_id': job.id,
            'from': from_acc,
            'to': to_acc,
            'amount': amount
        }}}
    )
    return am.jsonify({'msg': f'{job.name} created', 'id': job.id}), 201


# update to remove from specific user
@autopay_bp.route('/autopay/remove', methods=['DELETE'])
@am.jwt_required
def remove_autopay_route():
    scheduler.remove_all_jobs()
    am.clients.update_many(
        {'username': {'$exists': True}},
        {'$unset': {'auto_pay': ''}}
    )
    return am.jsonify({'msg': 'autopay removed from all user (for now)'}), 200