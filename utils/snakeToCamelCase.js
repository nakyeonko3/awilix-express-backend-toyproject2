// 스네이크케이스를 카멜케이스로 변환하는 함수
// ex) snakeToCamelCase('login_id') => 'loginId'
function snakeToCamelCase(str) {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace("-", "").replace("_", "")
  );
}

// const testArray = [
//   {
//     id: 1,
//     login_id: "C2319007",
//     password: "1q2w3e4r",
//     name: "김낙연",
//     email: "clock@gamil.com",
//     position: "차장",
//     phone: "010-2098-5620",
//     img: "https://i.imgur.com/3R9iaYo.jpeg",
//     is_deleted: 0,
//   },
// ];

// const result = testArray.map((user) => {
//   const newUser = {};
//   for (const key in user) {
//     newUser[snakeToCamelCase(key)] = user[key];
//   }
//   return newUser;
// });
// console.log(result);

// const testObj = {
//   id: 1,
//   login_id: "C2319007",
//   email: "clock@gamil.com",
//   position: "차장",
//   phone: "010-2098-5620",
//   img: "https://i.imgur.com/3R9iaYo.jpeg",
// };

// const result = {};
// for (const key in testObj) {
//   result[snakeToCamelCase(key)] = testObj[key];
// }
// console.log("result", result);

// console.log(snakeToCamelCase("loginId"));
export { snakeToCamelCase };
