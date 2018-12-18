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
import { PeerConfig, Peer } from '../../src/peer';

export const initializePeerConfigList = (): ReadonlyArray<PeerConfig> => {
	const peerOption1: PeerConfig = {
		ipAddress: '12.12.12.12',
		wsPort: 5001,
		height: 545776,
		inboundSocket: undefined,
		version: '1.0.1',
	};
	const peerOption2: PeerConfig = {
		ipAddress: '127.0.0.1',
		wsPort: 5002,
		height: 545981,
		inboundSocket: undefined,
		version: '1.0.1',
	};
	const peerOption3: PeerConfig = {
		ipAddress: '18.28.48.1',
		wsPort: 5008,
		height: 645980,
		inboundSocket: undefined,
		version: '1.4.1',
	};
	const peerOption4: PeerConfig = {
		ipAddress: '192.28.138.1',
		wsPort: 5006,
		height: 645982,
		inboundSocket: undefined,
		version: '1.0.1',
	};
	const peerOption5: PeerConfig = {
		ipAddress: '178.21.90.199',
		wsPort: 5001,
		height: 645980,
		inboundSocket: undefined,
		version: '1.2.1',
	};

	return [peerOption1, peerOption2, peerOption3, peerOption4, peerOption5];
};

export const initializePeerList = (): ReadonlyArray<Peer> =>
	initializePeerConfigList().map((peerConfig: PeerConfig) => new Peer(peerConfig))
