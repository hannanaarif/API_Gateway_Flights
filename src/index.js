const express=require('express');
const {ServerConfig,Logger}=require('./config');
const rateLimit=require('express-rate-limit')
const apiRoutes=require('./routes');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app=express();
const PORT=ServerConfig.PORT;

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 30, // Limit each IP to 3 requests per `window` (here, per 3 minutes).
})
app.use(limiter);

app.use('/flightsService',createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE,
    changeOrigin:true,
    pathRewrite:{'^/flightsService':'/'}
}));

app.use('/bookingService',createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin:true,
    pathRewrite:{'^/bookingService':'/'}
}));


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api',apiRoutes);

app.listen(PORT,()=>{
    console.log(`Successfully started the server on PORT: ${PORT}`);
    Logger.info("Successfully started the server",{});
})