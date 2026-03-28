function errorHandler(err, req, res, next) {
  console.error("Hata logu:", err.message); // geliştirici için log

  // Eğer hata özel statusCode taşıyorsa onu kullan
  const status = err.statusCode || 500;

  res.status(status).json({
    status: "error",
    message: err.message || "Bir hata oluştu",
  });
}


module.exports = {errorHandler}