
function abc() {
  return new Promise((resolve, reject) => {
    for (let i = 5; i >= 0; i--) {
      setTimeout(() => {
        //if (i === 1) return reject(new Error("---1---"));
        if (i === 2)    resolve(i);
        if (i > 0) console.log(i + "...");
        //else resolve(console.log("GO"));
      }, (5 - i) * 1000);
    }
  });
}
//abc().catch((err)=>{console.log("==========:"+err.message);});
abc().then((re) => {
    console.log("wwwwwwwwwwwwwww"+re);
  });
