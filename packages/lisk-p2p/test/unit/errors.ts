/*
 * Copyright © 2018 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */
import { expect } from 'chai';
import {
	NotEnoughPeersError,
	PeerTransportError,
	RPCGetPeersFailedError,
} from '../../src';

describe('errors', () => {
	describe('#NotEnoughPeersError', () => {
		let notEnoughPeersError: NotEnoughPeersError;
		const defaultMessage =
			'Requested number of peers is greater than available good peers';

		beforeEach(() => {
			notEnoughPeersError = new NotEnoughPeersError(defaultMessage);
			return Promise.resolve();
		});

		describe('should create an error object instance of NotEnoughPeersError', () => {
			it('should create a new instance of NotEnoughPeersError', () => {
				return expect(notEnoughPeersError)
					.to.be.an('object')
					.and.be.instanceof(NotEnoughPeersError);
			});

			it('should set error name to `NotEnoughPeersError`', () => {
				return expect(notEnoughPeersError.name).to.eql('NotEnoughPeersError');
			});
		});

		describe('should set error object properties', () => {
			beforeEach(() => {
				notEnoughPeersError = new NotEnoughPeersError(defaultMessage);
				return Promise.resolve();
			});

			it('should set error message when passed an argument', () => {
				return expect(notEnoughPeersError.message).to.eql(defaultMessage);
			});
		});
	});

	describe('#PeerTransportError', () => {
		let peerTransportError: PeerTransportError;
		let peerId = '0.0.0.0:80';
		const defaultMessage = `Received inbound connection from peer ${peerId} which is already in our triedPeers map.`;

		beforeEach(() => {
			peerTransportError = new PeerTransportError(defaultMessage, peerId);
			return Promise.resolve();
		});

		describe('should create an error object', () => {
			it('should create a new instance of PeerTransportError', () => {
				return expect(peerTransportError)
					.to.be.an('object')
					.and.be.instanceof(PeerTransportError);
			});

			it('should set error name to `PeerTransportError`', () => {
				return expect(peerTransportError.name).to.eql('PeerTransportError');
			});
		});

		describe('should set error object property', () => {
			beforeEach(() => {
				peerTransportError = new PeerTransportError(defaultMessage, peerId);
				return Promise.resolve();
			});

			it('should set error property peerId when passed as an argument', () => {
				return expect(peerTransportError.peerId).to.eql(peerId);
			});
		});
	});

	describe('#RPCGetPeersFailed', () => {
		let rpcGetPeersFailed: RPCGetPeersFailedError;
		const peerId = '127.0.0.1:5001';
		const defaultMessage = `Error when fetching peerlist of peer with peer id ${peerId}`;
		const defaultError = new Error('Peer not available');

		beforeEach(() => {
			rpcGetPeersFailed = new RPCGetPeersFailedError(
				defaultMessage,
				defaultError,
				peerId,
			);
			return Promise.resolve();
		});

		describe('should create an error object', () => {
			it('should create a new instance of RPCGetPeersFailed', () => {
				return expect(rpcGetPeersFailed)
					.to.be.an('object')
					.and.be.instanceof(RPCGetPeersFailedError);
			});

			it('should set error name to `RPCGetPeersFailed`', () => {
				return expect(rpcGetPeersFailed.name).to.eql('RPCGetPeersFailed');
			});
		});

		describe('should set error object properties', () => {
			beforeEach(() => {
				rpcGetPeersFailed = new RPCGetPeersFailedError(
					defaultMessage,
					defaultError,
					peerId,
				);
				return Promise.resolve();
			});

			it('should set error property peerId when passed as an argument', () => {
				return expect(rpcGetPeersFailed)
					.and.to.have.property('peerId')
					.which.is.eql(peerId);
			});

			it('should set error property cause when passed as an argument', () => {
				expect(rpcGetPeersFailed)
					.and.to.have.property('cause')
					.and.to.be.a('function');

				return expect(rpcGetPeersFailed.cause())
					.is.instanceOf(Error)
					.has.property('message')
					.and.eql('Peer not available');
			});
		});
	});
});
