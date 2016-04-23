import Session from "./Session";

var log = require("winston");

export default class SessionManager {

    private _io: any;
    private _sessions = {};

    constructor(io: any) {
        this._io = io;
    }

    public getOrCreateSession(sessionName: string): Session {
        if (this._sessions[sessionName]) {
            log.info("Session exists: " + sessionName);
            return this._sessions[sessionName];
        }

        log.info("Creating new session: " + sessionName);
        var newSession = new Session(sessionName, this._io);
        this._sessions[sessionName] = newSession;
        return newSession;
    }

    public getSession(sessionName: string): Session {
        if (!this._sessions[sessionName]) {
            return null;
        }

        return this._sessions[sessionName];
    }

    public endSession(sessionName: string): void {
        // TODO: Clean up all plugins and close gracefully. 
        // Need to make sure the results don't conflict with another session
        
        log.info("Deleting session: " + sessionName);
        if (this._sessions[sessionName]) {
            delete this._sessions[sessionName];
        }
    }
}
