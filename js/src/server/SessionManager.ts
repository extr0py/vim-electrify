import Session from "./Session";
import IRemoteCommandExecutor = require("./Commands/IRemoteCommandExecutor");

import {EventEmitter} from "events";

var log = require("winston");

var SessionStartEvent = "start";
var SessionEndEvent= "end";

export default class SessionManager extends EventEmitter {

    private _io: any;
    private _sessions = {};
    private _commandExecutor: IRemoteCommandExecutor;

    constructor(io: any, commandExecutor: IRemoteCommandExecutor) {
        super();

        this._io = io;
        this._commandExecutor = commandExecutor;
    }

    public getSessions(): Session[] {
        return Object.keys(this._sessions).map((k) => (this._sessions[k]));
    }

    public getOrCreateSession(sessionName: string): Session {
        if (this._sessions[sessionName]) {
            log.info("Session exists: " + sessionName);
            return this._sessions[sessionName];
        }

        log.info("Creating new session: " + sessionName);
        var newSession = new Session(sessionName, this._io, this._commandExecutor);

        this._sessions[sessionName] = newSession;

        this.emit(SessionStartEvent, newSession);

        return newSession;
    }

    public getSession(sessionName: string): Session {
        if (!this._sessions[sessionName]) {
            return null;
        }

        return this._sessions[sessionName];
    }

    public endSession(sessionName: string): void {
        log.info("Deleting session: " + sessionName);
        if (this._sessions[sessionName]) {
            var session = this._sessions[sessionName];

            this.emit(SessionEndEvent, session);

            session.dispose();
            session = null;
            delete this._sessions[sessionName];
        }
    }
}
