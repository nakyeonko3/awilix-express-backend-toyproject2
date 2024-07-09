import { container } from './container.js';
import express from 'express';
import history from 'connect-history-api-fallback';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import path from 'path';
import { indb, initializeDatabase } from './initalizeData.js';

const app = express();
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(
  history({
    verbose: true,
    rewrites: [
      {
        from: /^\/api\/.*$/,
        to: function (context) {
          return context.parsedUrl.pathname;
        },
      },
      {
        from: /^\/dist\/.*$/,
        to: function (context) {
          return context.parsedUrl.pathname;
        },
      },
    ],
  })
);

app.use(
  express.static(path.join(__dirname, '../dist'), {
    setHeaders: (res, filePath) => {
      if (path.extname(filePath) === '.css') {
        res.setHeader('Content-Type', 'text/css');
      } else if (path.extname(filePath) === '.js') {
        res.setHeader('Content-Type', 'application/javascript');
      }
    },
  })
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const userController = container.resolve('userController');
app.use('/api/v1/users', userController.router);

const attendanceController = container.resolve('attendanceController');
app.use('/api/v1/attendance', attendanceController.router);

const galleryController = container.resolve('galleryController');
app.use('/api/v1/gallery', galleryController.router);

//employees, attendances 테이블 데이터베이스 초기화
initializeDatabase();

app.get('/api/employees', (req, res) => {
  indb.getAllEmployees(employees => {
    res.json({
      status: 'OK',
      data: employees,
    });
  });
});

app.get('/api/employees/:id', (req, res) => {
  const id = req.params.id;
  console.log(`/api/employees/${id} 라우팅 확인`);
  indb.getEmployeeById(id, employee => {
    res.json({
      status: 'OK',
      data: employee,
    });
  });
});

app.post('/api/employees', (req, res) => {
  const employee = req.body;
  console.log(employee);
  indb.insertEmployee(employee);
  res.json({
    status: 'OK',
  });
});

app.put('/api/employees', (req, res) => {
  const employee = req.body;
  console.log(employee);
  indb.updateEmployee(employee);
  res.json({
    status: 'OK',
  });
});

app.get('/api/attendances', (req, res) => {
  indb.getAllAttendances(attendance => {
    res.json({
      status: 'OK',
      data: attendance,
    });
  });
});

//시간값 넣기
// app.post('/api/employees/setTime', (req, res) => {
//   const timeset = req.body;
//   console.log(timeset);
//   // indb.insertTime(employee.username, employee.password, (employee) => {
//   //   res.json({
//   //     status: 'OK',
//   //     data: employee,
//   //   });
//   // });
// })
// //예시
// app.get('/api/employees/:id', (req, res) => {
//   const id = req.params.id;
//   console.log(`/api/employees/${id} 라우팅 확인`)
//   indb.getEmployeeById(id, (employee) => {
//     res.json({
//       status: 'OK',
//       data: employee,
//     });
//   });
// });

//시간값 꺼내기
app.get('/api/employees/getTime/:id', (req, res) => {
  const id = req.params.id;
  console.log(`/api/employees/getTime/${id} 라우팅 확인`);
  indb.getTime(id, lastpunch => {
    res.json({
      status: 'OK',
      data: lastpunch,
    });
  });
  /*상태값 
    요청값에 현재 시간 보낸거 잘라서 쓰기(yyyy-mm-dd:hh12:mm)
    오늘 날짜(년 -월 -일)를 잘라서 가져오기

    0- 출근전 => 오늘 날짜의 출근 시간이 없다고 하면 setTime으로 데이터 생성
    1- 근무중 => 오늘 날짜의 출근 시간이 있고 퇴근 시간이 없는 경우에는 setTime으로 퇴근 시간 생성
    2- 퇴근 => 오늘 날짜의 퇴근 시간이 있으면 에러 리턴
    */

  // indb.getEmployeeByIdPw(employee.username, employee.password, (employee) => {
  //   res.json({
  //     status: 'OK',
  //     data: employee,
  //   });
  // });
});

//아이디 비밀번호 체크
app.post('/api/employees/loginCheck', (req, res) => {
  const employee = req.body;
  console.log(employee);
  indb.getEmployeeByIdPw(employee.username, employee.password, employee => {
    res.json({
      status: 'OK',
      data: employee,
    });
  });
});

app.get('/api/v2/users', (req, res) => {
  res.json({
    user: {
      1234: {
        userId: '1234',
        userPassword: 'password',
        userName: '홍길동',
        userEmail: 'hong@gmail.com',
        userPhone: '123-456-7890',
        userPosition: '차장',
      },
      4567: {
        userId: '4567',
        userPassword: 'password',
        userName: '세종대왕',
        userEmail: 'se@gmail.com',
        userPhone: '098-765-4321',
        userPosition: '부장',
      },
    },
  });
});
