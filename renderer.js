const path = require("path");
const fs = require("fs-extra");
const exec = require("child_process").execSync;
const spawn = require("child_process").spawn;
const serverPath = path.join(process.env.home, "colour-point");
const status = {
    stopped: "stopped",
    notInstalled: "not installed",
    running: "running...",
    installing: "installing...",
    uninstalling: "uninstalling...",
    updating: "updating..."
};
process.serverProc = null;
let currentStatus = status.notInstalled;
var psTree = require("ps-tree");

kill = function(pid, signal, callback) {
    signal = signal || "SIGKILL";
    callback = callback || function() {};
    var killTree = true;
    if (killTree) {
        psTree(pid, function(err, children) {
            [pid]
                .concat(
                    children.map(function(p) {
                        return p.PID;
                    })
                )
                .forEach(function(tpid) {
                    try {
                        process.kill(tpid, signal);
                    } catch (ex) {}
                });
            callback();
        });
    } else {
        try {
            process.kill(pid, signal);
        } catch (ex) {}
        callback();
    }
    process.serverProc = null;
};

document.addEventListener("DOMContentLoaded", function() {
    if (fs.existsSync(serverPath)) setStatus(status.stopped);
});
const setStatus = function(newStatus) {
    currentStatus = newStatus;
    document.getElementById("status").innerText = "Status: " + currentStatus;
};
const install = function() {
    const isInstalled = fs.existsSync(serverPath);
    if (!isInstalled) {
        setStatus(status.installing);
        setTimeout(function() {
            exec(
                "git clone https://www.github.com/TimUntersberger/colour-point.git colour-point",
                { cwd: process.env.home }
            );
            exec("npm install", { cwd: serverPath });
            setStatus(status.stopped);
        }, 50);
    }
};
const uninstall = function() {
    setStatus(status.uninstalling);
    setTimeout(function() {
        fs.removeSync(serverPath);
        setStatus(status.notInstalled);
    }, 50);
};
const update = function() {
    const isInstalled = fs.existsSync(serverPath);
    if (isInstalled && process.serverProc === null) {
        setStatus(status.updating);
        exec("git pull", { cwd: serverPath });
        setStatus(status.stopped);
    }
};
const start = function() {
    const isInstalled = fs.existsSync(serverPath);
    if (isInstalled && process.serverProc === null) {
        process.serverProc = spawn(
            process.platform.includes("win") ? "npm.cmd" : "npm",
            ["run", "start"],
            {
                cwd: serverPath,
                stdio: "inherit",
                detached: false
            }
        );
        setStatus(status.running);
    }
};
const stop = function() {
    if (process.serverProc === null) return;
    kill(process.serverProc.pid);
    setStatus(status.stopped);
};
const exit = function() {
    if (process.serverProc === null) return;
    kill(process.serverProc.pid, null, require("electron").remote.app.quit);
};
