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
import { PeerConfig, Peer } from '../../src/peer';
import { initializePeerList } from '../utils/peers';
import * as discoverPeersModule from '../../src/peer_discovery';

describe('peer discovery', () => {
	describe('#discoverPeer', () => {
		const peerOption: PeerConfig = {
			ipAddress: '12.13.12.12',
			wsPort: 5001,
			height: 545776,
			id: '12.13.12.12:5001',
		};
		const peerOptionDuplicate: PeerConfig = {
			ipAddress: '12.13.12.12',
			wsPort: 5001,
			height: 545981,
			id: '12.13.12.12:5001',
		};
		// TODO cover rpcRequesthandler
		const newPeer = new Peer(peerOption);
		const peerDuplicate = new Peer(peerOptionDuplicate);
		const peers = [...initializePeerList(), newPeer, peerDuplicate];
		const blacklist = [peers[4].id];

		describe('return an array with all the peers of input peers', () => {
			let discoveredPeers: ReadonlyArray<Peer>;
			const peerList1 = [newPeer];
			const peerList2 = [newPeer, peerDuplicate];
			const peerList3 = [newPeer, peers[2]];
			const discoveredPeersResult = [newPeer, peers[2]];

			beforeEach(async () => {
				sandbox
					.stub(discoverPeersModule, 'rpcRequestHandler')
					.resolves([peerList1, peerList2, peerList3]);

				discoveredPeers = await discoverPeersModule.discoverPeers(peers, {
					blacklist,
				});
			});

			it('should return an array', () => {
				expect(discoverPeersModule.rpcRequestHandler).to.be.calledWithExactly(
					peers,
					'getPeers',
				);

				return expect(discoveredPeers).to.be.an('array');
			});

			it('should return an array with length of 2', () => {
				expect(discoverPeersModule.rpcRequestHandler).to.be.calledWithExactly(
					peers,
					'getPeers',
				);

				return expect(discoveredPeers)
					.to.be.an('array')
					.of.length(2);
			});

			it('should return an array with discovered peers', () => {
				expect(discoverPeersModule.rpcRequestHandler).to.be.calledWithExactly(
					peers,
					'getPeers',
				);

				return expect(discoveredPeers)
					.to.be.an('array')
					.and.eql(discoveredPeersResult);
			});

			it('should return an array with discovered peers for blank blacklist', async () => {
				discoveredPeers = await discoverPeersModule.discoverPeers(peers, {
					blacklist: [],
				});
				expect(discoverPeersModule.rpcRequestHandler).to.be.calledWithExactly(
					peers,
					'getPeers',
				);

				return expect(discoveredPeers)
					.to.be.an('array')
					.and.eql(discoveredPeers);
			});
		});
	});
});
