const express=require('express');
const axios=require('axios');
const app=express();
app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
async function getdepotdata() {
    try {
        const response = await axios.get('http://4.224.186.213/evaluation-service/depots',
            {
                headers:{
                    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2JxMWE0OTQ5QHZ2aXQubmV0IiwiZXhwIjoxNzgwNjQxNTQzLCJpYXQiOjE3ODA2NDA2NDMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0ZThlMGJlZi1mZjcwLTQwZjQtYmFmMC1kMDFiYWY1YjIzNjUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ0YXJpcGkgbmFnYW1hbmkiLCJzdWIiOiI5YTdhNTJmYi04Y2U2LTQ2OWItOWJlZS04Yjk5Y2MxZWM4NDgifSwiZW1haWwiOiIyM2JxMWE0OTQ5QHZ2aXQubmV0IiwibmFtZSI6InRhcmlwaSBuYWdhbWFuaSIsInJvbGxObyI6IjIzYnExYTQ5NDkiLCJhY2Nlc3NDb2RlIjoiUVFkRVl5IiwiY2xpZW50SUQiOiI5YTdhNTJmYi04Y2U2LTQ2OWItOWJlZS04Yjk5Y2MxZWM4NDgiLCJjbGllbnRTZWNyZXQiOiJhdGtieENreUVRa2Z6R1RyIn0.G-h1cAGX7SInooUrVOulMCiixtF0uWI1X6F-_2qpg1k"}`
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error fetching depot data:', error);
        throw error;
    }
}async function gettaskdetails() {
    try{
        const response=await axios.get('http://4.224.186.213/evaluation-service/vehicles',
            {
                headers:{
                    Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyM2JxMWE0OTQ5QHZ2aXQubmV0IiwiZXhwIjoxNzgwNjQxNTQzLCJpYXQiOjE3ODA2NDA2NDMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI0ZThlMGJlZi1mZjcwLTQwZjQtYmFmMC1kMDFiYWY1YjIzNjUiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJ0YXJpcGkgbmFnYW1hbmkiLCJzdWIiOiI5YTdhNTJmYi04Y2U2LTQ2OWItOWJlZS04Yjk5Y2MxZWM4NDgifSwiZW1haWwiOiIyM2JxMWE0OTQ5QHZ2aXQubmV0IiwibmFtZSI6InRhcmlwaSBuYWdhbWFuaSIsInJvbGxObyI6IjIzYnExYTQ5NDkiLCJhY2Nlc3NDb2RlIjoiUVFkRVl5IiwiY2xpZW50SUQiOiI5YTdhNTJmYi04Y2U2LTQ2OWItOWJlZS04Yjk5Y2MxZWM4NDgiLCJjbGllbnRTZWNyZXQiOiJhdGtieENreUVRa2Z6R1RyIn0.G-h1cAGX7SInooUrVOulMCiixtF0uWI1X6F-_2qpg1k"}`
                }
            }
        );
        return response.data;
    }
    catch(error){
        console.error('Error fetching vehicle data:',error);
        throw error;
    }
    }
    function maintenance(depotdata,vehiledata,maxhrs){
        const tasks=vehiledata.vehicles.map(vehicle=>({
            id: vehicle.TaskID,
            time: vehicle.Duration,
            score: vehicle.Impact
        }));
        let maxscore=0;
        
        for(let i=0;i<tasks.length;i++){
            let sum=0;
            let s=0;
            for(let j=i;j<tasks.length;j++){
            sum=sum+tasks[j].time;
            if(sum<=maxhrs){
                s=s+tasks[j].score;
                maxscore=Math.max(maxscore,s);

            }
            else{
                break;
            }
        }

    }
    return maxscore;
} 
app.get('/schedule',async(req,res)=>{
    try{
    const depotdata=await getdepotdata();
    const vehicledata=await gettaskdetails();
    console.log(depotdata);
    console.log(vehicledata);
    const maxhrs=depotdata.depots[0].MechanicHours;
    const result=maintenance(depotdata,vehicledata,maxhrs);
    res.json(result);
    }catch(error){
    console.log("ERROR:");
    console.log(error.message);

    if(error.response){
        console.log(error.response.status);
        console.log(error.response.data);
    }

    res.status(500).json({
        error: error.message
    });
}
});
const port=3000;
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
});



