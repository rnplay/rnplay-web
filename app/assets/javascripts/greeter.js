function hello(name) {
  alert('Hello, ' + name + '!');
}
 
function goodbye(name) {
  alert('Goodbye, ' + name + '!');
}
 
module.exports = {
  sayHello: hello,
  sayGoodbye: goodbye
};
