#Route Parameter

app.get("/api/user/:id",(req,res)=>{
console.log(req.params.id) // it will return string
})

// http://localhost:3000/api/user/10

#Query Parameters

// http://localhost:3000/api/user?id=1&name="ok"

app.get("/api/user",(req,res)=>{
console.log(req.query)
})
