import { remote } from "electron";
import { spawn, exec } from "child_process";
import { existsSync } from "fs";
import path from "path";
import Kill from "tree-kill";

const serverPath = path.join(process.env.homepath, "colour-point");

module.exports = {
    exit: serverPid => {
        if (serverPid === 0) remote.app.quit();
        else Kill(serverPid, () => remote.app.quit());
    },
    startServer: cb => {
        if (!existsSync(serverPath)) return -1;
        const child = spawn(
            "npm",
            ["run", "start"],
            {
                cwd: serverPath,
                shell: true
            },
            cb
        );
        console.log(child.error || child.output);
        return child.pid;
    },
    stopServer: (serverPid, cb) => {
        Kill(serverPid, cb);
    },
    updateServer: cb => {
        if (!existsSync(serverPath)) return -1;
        exec("git pull", { cwd: serverPath }, cb);
    }
};
