import { EventEmitter } from 'events';
import http, { Server } from 'http';
import querystring from 'querystring';
import { ILogger } from './p2p_types';
import { Peer } from './peer';

export interface IPeerPoolConfig {
	readonly logger: ILogger;
}

const socketClusterServer = require('socketcluster-server');

export class PeerPool extends EventEmitter {
	public httpServer: Server;
	public logger: ILogger;
	public newPeers: Map<string, Peer>;
	public scServer: any;
	public triedPeers: Map<string, Peer>;

	public constructor(config: IPeerPoolConfig) {
		super();

		this.httpServer = http.createServer();
		this.scServer = socketClusterServer.attach(this.httpServer);
		this.newPeers = new Map();
		this.triedPeers = new Map();
		this.logger = config.logger;

		this.handleInboundConnections(this.scServer);
	}

	public getNewPeers(): ReadonlyArray<Peer> {
		return Array.from(this.newPeers.values());
	}

	public getTriedPeers(): ReadonlyArray<Peer> {
		return Array.from(this.triedPeers.values());
	}

	private addInboundPeerToMaps(peer: Peer): void {
		const peerId: string = peer.getId();

		if (this.triedPeers.has(peerId)) {
			this.logger.trace(
				`Received inbound connection from peer ${peerId} which is already in our triedPeers map.`,
			);
		} else if (this.newPeers.has(peerId)) {
			this.logger.trace(
				`Received inbound connection from peer ${peerId} which is already in our newPeers map.`,
			);
		} else {
			this.logger.trace(`Received inbound connection from new peer ${peerId}`);
			this.newPeers.set(peerId, peer);
			super.emit('newInboundPeer', peer);
			super.emit('newPeer', peer);
		}
	}

	private handleInboundConnections(scServer: any): void {
		scServer.on('connection', (socket: any) => {
			const queryObject: any = querystring.parse(socket.request.url);
			const peer: Peer = new Peer({
				id: `${socket.remoteAddress}:${queryObject.wsPort}`,
				clock: new Date(),
				httpPort: queryObject.httpPort,
				ip: socket.remoteAddress,
				os: queryObject.os,
				version: queryObject.version,
				wsPort: queryObject.wsPort,
				inboundSocket: socket,
				logger: this.logger,
			});
			this.addInboundPeerToMaps(peer);
		});
	}
}
