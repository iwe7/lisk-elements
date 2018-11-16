import { generateMnemonic } from 'bip39';
import { Queue } from '../src/queue';
import transaction from '@liskhq/lisk-transactions'
import cryptography from '@liskhq/lisk-cryptography';
import { Transaction } from '../src';
import { expect } from 'chai';

function createRandomTransaction (): Transaction {
    const senderPassphrase = generateMnemonic();
    const receipientAccount = cryptography.getAddressAndPublicKeyFromPassphrase(generateMnemonic())

	// tslint:disable-next-line
    return transaction.transfer({
        amount: (Math.floor(Math.random() * 100000)).toString(),
        passphrase: senderPassphrase,
        recipientId: receipientAccount.address
    }) as Transaction;
}

describe('Queue', () => {
    let queue: Queue;

    beforeEach(() => {
        queue = new Queue();
    });

    describe('enqueueOne', () => {
        it('should add transaction to the queue', () => {
            const transaction = createRandomTransaction();
            queue.enqueueOne(transaction);
            expect(queue.transactions).to.include(transaction);
        });

        it('should add transaction to the queue index', () => {
            const transaction = createRandomTransaction();
            queue.enqueueOne(transaction);
            expect(queue.index[transaction.id]).to.deep.eq(transaction);
        });
    });

    describe('enqueueMany', () => {
        it('should add transactions to the queue', () => {
            const transactions = new Array(5).fill(0).map(createRandomTransaction);
            queue.enqueueMany(transactions);
            transactions.forEach((transaction: Transaction) => expect(queue.transactions).to.include(transaction));
        });

        it('should add transactions to the queue index', () => {
            const transactions = new Array(5).fill(0).map(createRandomTransaction);
            queue.enqueueMany(transactions);
            transactions.forEach((transaction: Transaction) => expect(queue.index[transaction.id]).to.eq(transaction));
        });
    });

    describe('exists', () => {
        it('should return true if transaction exists in queue', () => {
            const transaction = createRandomTransaction();
            queue.enqueueOne(transaction);
            expect(queue.exists(transaction)).to.equal(true);
        });

        it('should return false if transaction does not exist in queue', () => {
            const transaction = createRandomTransaction();
            expect(queue.exists(transaction)).to.equal(false);
        });
    });

    describe('removeFor', () => {
        let transactions: ReadonlyArray<Transaction>;
        const alwaysReturnFalse = () => () => false;
        const checkIdsExists = (ids: ReadonlyArray<string>): (transaction: Transaction) => boolean => {
            return (transaction: Transaction) => ids.indexOf(transaction.id) !== -1;
        };

        beforeEach(() => {
            transactions = new Array(5).fill(0).map(createRandomTransaction);
            queue.enqueueMany(transactions);
        });

        it('should not remove any transactions if the condtion fails for all transactions', () => {
            const deletedTransactions = queue.removeFor(alwaysReturnFalse());
            expect(deletedTransactions).to.have.length(0);
            expect(queue.transactions).to.deep.eq(transactions);
        });

        it('should return removed transactions which pass condition', () => {
            const [toRemoveTransaction1, toRemoveTransaction2, ...tokeepTransactions] = transactions;
            const condition = checkIdsExists([toRemoveTransaction1.id, toRemoveTransaction2.id]);

            const removedTransactions = queue.removeFor(condition);
            expect(removedTransactions).to.deep.eq([toRemoveTransaction1, toRemoveTransaction2]);
            expect(queue.transactions).to.deep.eq(tokeepTransactions);
        });

        it('should remove transactions which pass condition', () => {
            const [toRemoveTransaction1, toRemoveTransaction2, ...tokeepTransactions] = transactions;
            const condition = checkIdsExists([toRemoveTransaction1.id, toRemoveTransaction2.id]);

            queue.removeFor(condition);
            expect(queue.transactions).to.not.contain([toRemoveTransaction1, toRemoveTransaction2]);
            expect(queue.transactions).to.deep.eq(tokeepTransactions);
        });

        it('should remove queue index for transactions which pass condition', () => {
            const [toRemoveTransaction1, toRemoveTransaction2, ...tokeepTransactions] = transactions;
            const condition = checkIdsExists([toRemoveTransaction1.id, toRemoveTransaction2.id]);

            queue.removeFor(condition);
            expect(queue.index[toRemoveTransaction1.id]).to.not.exist;
            expect(queue.index[toRemoveTransaction2.id]).to.not.exist;
            expect(queue.transactions).to.deep.eq(tokeepTransactions);
        });
    });

    describe('dequeueUntil', () => {
        let transactions: ReadonlyArray<Transaction>;

        const returnTrueUntilLimit = (limit: number) => {
            let currentValue = 0;

            return () => currentValue++ < limit;
        }

        beforeEach(() => {
            transactions = new Array(5).fill(0).map(createRandomTransaction);
            queue.enqueueMany(transactions);
        });

        it('should not dequeue any transactions if the condtion fails for first transaction', () => {
            const dequeuedTransactions = queue.dequeueUntil(returnTrueUntilLimit(0));
            expect(dequeuedTransactions).to.have.length(0);
            expect(queue.transactions).to.deep.eq(transactions);
        });

        it('should return dequeued transactions which pass condition', () => {
            const [secodLastTransaciton, lastTransaction] = transactions.slice(transactions.length - 2, transactions.length);;
            const condition = returnTrueUntilLimit(2);

            const dequeuedTransactions = queue.dequeueUntil(condition);
            expect(dequeuedTransactions).to.deep.eq([secodLastTransaciton, lastTransaction]);
        });

        it('should dequeue 2 transactions', () => {
            const [secodLastTransaciton, lastTransaction] = transactions.slice(transactions.length - 2, transactions.length);;
            const condition = returnTrueUntilLimit(2);

            queue.dequeueUntil(condition);
            expect(queue.transactions).to.not.contain([secodLastTransaciton, lastTransaction]);
            expect(queue.transactions).to.deep.eq(transactions.slice(0, transactions.length -2));
        });

        it('should remove queue index for transactions which pass condition', () => {
            const [secodLastTransaciton, lastTransaction] = transactions.slice(transactions.length - 2, transactions.length);;
            const condition = returnTrueUntilLimit(2);

            queue.dequeueUntil(condition);
            expect(queue.index[lastTransaction.id]).to.not.exist;
            expect(queue.index[secodLastTransaciton.id]).to.not.exist;
        });
    });
});