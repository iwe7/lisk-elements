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
import { PeerConfig } from '../../src/peer';
import { helperAllPeersRPC } from '../../src/rpc_handler';

describe('rpc Handler', () => {
	let peersFromResponse = [
		{
			ip: '12.45.12.12',
			wsPort: '5002',
			height: '121323',
			os: 'ubuntu',
			version: '1.1.1',
		},
		{
			ip: '127.34.00.78',
			wsPort: '5001',
			height: '453453',
			os: 'windows',
			version: '1.2.1',
		},
	];

	let newlyCreatedPeers = peersFromResponse.map(
		peer => {
			const peerWithConfig: PeerConfig = {
				ipAddress: peer.ip,
				wsPort: +peer.wsPort,
				height: +peer.height,
				os: peer.os,
				version: peer.version,
			}

			return peerWithConfig;
		}
	);

	describe('#getPeersRPCHandler', () => {
		let peersRPCHandler: ReadonlyArray<PeerConfig>;
		let response: unknown;

		beforeEach(async () => {
			response = { peers: peersFromResponse };
			peersRPCHandler = helperAllPeersRPC(response);
		});

		it('should return an array', () => {
			return expect(peersRPCHandler)
				.to.be.an('array')
				.and.of.length(2);
		});

		it('should return an array of instantiated peers', () => {
			return expect(peersRPCHandler)
				.to.be.an('array')
				.eql(newlyCreatedPeers);
		});

		it('should return an array of instantiated peers', () => {
			peersRPCHandler = helperAllPeersRPC(undefined);

			return expect(peersRPCHandler)
				.to.be.an('array')
				.eql([]);
		});

		it('should return an array of instantiated peers', () => {
			peersRPCHandler = helperAllPeersRPC('string value');

			return expect(peersRPCHandler)
				.to.be.an('array')
				.eql([]);
		});
	});
});
