import React from "react";
import {
    Button,
    Switch,
    FormControlLabel,
    AppBar,
    Toolbar,
    Typography,
    CircularProgress
} from "material-ui";
import { Close } from "material-ui-icons";
import Lib from "../lib";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.serverPid = 0;
        this.state = {
            isOnline: false,
            updating: false,
            isDialogOpen: false,
            dialogBody: ""
        };
        this.styles = {
            switch: {
                width: "100%"
            },
            button: {
                width: "100%",
                marginBottom: 5
            },
            appBar: {
                WebkitUserSelect: "none",
                WebkitAppRegion: "drag"
            },
            content: {
                paddingLeft: 10,
                paddingRight: 10
            }
        };
    }

    handleServerUpdated = (err, stdout) => {
        new Notification("Server update ended", {
            body: err ? "Something went wrong" : stdout
        });
        this.setState({
            updating: false
        });
    };

    handleServerStateChange = (event, checked) => {
        if (checked) console.log((this.serverPid = Lib.startServer()));
        else Lib.stopServer(this.serverPid, () => console.log("stopped"));
        this.setState({ isOnline: checked });
    };

    render = () => {
        return (
            <div>
                <AppBar position="static" style={this.styles.appBar}>
                    <Toolbar>
                        <Typography
                            type="title"
                            color="inherit"
                            style={{ width: "100%", textAlign: "center" }}
                        >
                            Colour&Point
                        </Typography>
                    </Toolbar>
                </AppBar>
                <div style={this.styles.content}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.state.isOnline}
                                onChange={this.handleServerStateChange}
                            />
                        }
                        label={
                            this.state.isOnline
                                ? "Server is online"
                                : "Server is offline"
                        }
                        style={this.styles.switch}
                    />
                    <br />
                    <Button
                        raised
                        disabled={this.state.isOnline}
                        color="primary"
                        style={this.styles.button}
                        onClick={() => {
                            this.setState({ updating: true });
                            Lib.updateServer(this.handleServerUpdated);
                        }}
                    >
                        {this.state.updating ? (
                            <CircularProgress size={20} color="accent" />
                        ) : (
                            "Update"
                        )}
                    </Button>
                    <Button
                        raised
                        color="primary"
                        style={this.styles.button}
                        onClick={() => Lib.exit(this.serverPid)}
                    >
                        Exit
                    </Button>
                </div>
            </div>
        );
    };
}
export default App;
