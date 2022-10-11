import fs from "fs"

const ErrorCapture = () => {
    try{
        const ReadErr = fs.readFileSync("./src/megalinter-reports/linters_logs/ERROR-PYTHON_PYRIGHT.log",{
            encoding : "utf-8",
            flag : "r"
        })
        
        const ValArr = ReadErr.split("\n")
        
        let Index:any;
        
         ValArr.filter((i,ind)=>{
            if(i === 'pyright 1.1.270'){
                Index = ind;
            }
        })
        
        ValArr.splice(0,Index+1)
        
        const ErrorArr = ValArr.filter(i => i !== "")
        
        
        let arrofline: { Line: string; StartIndex: string; }[] = []
        let arrofsev: any[] = []
        let finalArr: { Line: string; StartIndex: string; Severity: any; Message: any; }[] = [];
        ErrorArr.map((it)=>{
            if(it.match(/(error|warning):/) !== null){
                const splitted = it.split("-")
                splitted.forEach((ix,ind) => {
                    if(ind === 0){
                        const alint = ix.split(":")
                        arrofline.push({
                            Line : alint[1],
                            StartIndex : alint[2]
                        })
                    }
                    if(ind === 1){
                        const alint = ix.split(":")
                        arrofsev.push({
                            severity : alint[0],
                            message : alint[1]
                        })
                    }
                })
            }
        }).filter(i => i !== undefined)
        
        
        arrofline.forEach((obj,ind)=>{
            const singSev = arrofsev[ind]
            finalArr.push({
                Line : obj.Line,
                StartIndex : obj.StartIndex,
                Severity : singSev.severity,
                Message : singSev.message
            })
        })
        return finalArr;
    }catch(err){
        return "Error"
    }
}

export {ErrorCapture as PythonErrorLint};