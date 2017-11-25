import { remote } from "electron";
import { spawn, exec } from "child_process";
import { existsSync } from "fs";
import path from "path";
import Kill from "tree-kill";

const serverPath = path.join(process.env.homepath || process.env.HOME, "colour-point");

module.exports = {
    exit: serverPid => {
        if (serverPid === 0) remote.app.quit();
        else Kill(serverPid, () => remote.app.quit());
    },
    startServer: cb => {
        const child = spawn(
            "npm",
            ["run", "start"],
            {
                cwd: serverPath,
                shell: true
            },
            cb
        );
        return child.pid;
    },
    stopServer: (serverPid, cb) => {
        Kill(serverPid, cb);
    },
    updateServer: cb => {
        exec("git pull", { cwd: serverPath }, cb);
    }
};
