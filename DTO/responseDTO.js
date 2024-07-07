export class ResponseDTO {
  constructor(status, message, data) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success(data, message = "success") {
    return new ResponseDTO(200, message, data);
  }

  static fail(message = "fail") {
    return new ResponseDTO(400, message, null);
  }
}

console.log(ResponseDTO.success({ name: "kim" }));
console.log(ResponseDTO.fail("fail"));
