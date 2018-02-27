function compose(arr) {
  return function(ctx) {
    const next = function() {
      const fn = arr.shift();
      fn && fn(ctx, next);
    };
    const fn = arr.shift();
    fn && fn(ctx, next);
  };
}

function fun1(ctx, next) {
  ctx.count++;
  console.log(ctx.count);
  next();
}
function fun2(ctx, next) {
  ctx.count++;
  console.log(ctx.count);
  setTimeout(function() {
    next();
  }, 1000);
}
function fun3(ctx, next) {
  ctx.count++;
  console.log(ctx.count);
  next();
}
compose([fun1, fun2, fun3])({ count: 1 }); // 2 3 4
