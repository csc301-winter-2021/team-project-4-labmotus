import React, {useEffect} from "react";
import main from "../../cloud/src/wrnch/processWrnch";

const App: React.FC = () => {
    useEffect(() => {
        main();
        return () => {
            Array.prototype.slice.call(document.getElementsByTagName("canvas")).forEach((value: any) => value.remove())
        }
    }, []);

    return (<div/>)
};

export default App;
