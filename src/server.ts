import { exec } from "child_process";
import Express from "express";
import fs from "fs"
import {ErrorLintList,ExtensionList} from "./Constants"

const app = Express()

app.use(Express.json())


const generateFile = (code:string,ext:string) => {
    try {
        fs.writeFileSync(`./LintFolder/main.${ext}`,code,{
            encoding : "utf-8",
            flag : "w"
        })
        return "success"
    } catch (error) {
        return "error"
    }
}


app.post("/lint",(req:Express.Request,res:Express.Response)=>{
    exec("npm run clearfile",(err,stdout,stderr)=>{
        if(err){
            res.status(403).json("Something Wrong")
        }
        exec("mkdir LintFolder",(err,stdout,stderr)=>{
            if(err){
                res.status(403).json("Something Wrong")
            }
            const GenFile = generateFile(req.body.code,ExtensionList.python)
            if(GenFile === "error"){
                res.json("failed")
            }
            exec("npm run lintcall",(err,stdout,stderr)=>{
                const checkFile = fs.existsSync("./LintFolder/megalinter-reports/linters_logs/ERROR-PYTHON_PYRIGHT.log")
                if(checkFile){
                    res.json(ErrorLintList.python())
                }else if(err){
                    res.status(403).json("Something Wrong")
                }else{
                    res.json("done")
                }
            })
        })
    })
})

app.listen(3500,()=>{
    console.log("server started")
})