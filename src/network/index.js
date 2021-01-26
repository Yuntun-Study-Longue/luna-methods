const handleGClientIP = (REQUEST) => (
  REQUEST['headers']['x-real-ip']||
  REQUEST['headers']['x-forwarded-for'] ||
  '127.0.0.1'
)

module.exports = {
  handleGClientIP,
}