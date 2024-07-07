## ERD

![](https://i.imgur.com/HokagIE.png)

## sqlite 쿼리문

```sql
-- 직원 정보
CREATE TABLE IF NOT EXISTS users (
    id integer primary key,
    login_id text unique not null,
    user_password TEXT not null ,
    name TEXT not null,
    email TEXT,
    position TEXT,
    phone TEXT,
    img TEXT,
    is_deleted INTEGER DEFAULT 0
);


-- 출근 시간
CREATE TABLE IF NOT EXISTS time_punch (
    id integer primary key,
    user_id integer not null,
    punch_in text,
    punch_out text,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- drop table attendance;

-- 근태 신청
create table if not exists attendance(
    id integer PRIMARY KEY,
    user_id integer not null,
    title text,
    content text,
    attendance_start_date text,
    attendance_days integer,
    attendance_type text not null,
    attendance_apply_time text DEFAULT (datetime('now', '+9 hours')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


-- drop table administrator;

-- 관리자 계정
create table if not exists administrator(
    id integer primary key,
    login_id text unique,
    name text not null,
	administrator_password text not null,
    user_id integer unique,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 기업 갤러리
create table if not exists company_gallery(
    id integer primary key,
    administrator_id integer not null,
    title TEXT,
    content text,
    img text,
    FOREIGN KEY (administrator_id) REFERENCES administrator(id)
);
```

```sql


-- 1. 직원 CRUD

-- 1-1. 직원 등록
-- 직원 이름, 아이디, 비밀번호, 직급을 등록함.
insert into
    users(login_id, user_password, name, position)
    values('C1234', '1234','고낙연','대리');

-- 1-2. 직원 로그인
-- 해당 직원 아이디와 비밀번호가 존재하는지 확인함.
-- 해당 직원이 존재한다면 직원 아이디, 이메일, 직급, 핸드폰번호, 프로필이미지를 리턴함.
select
    login_id, email, position, phone, img
from
    users
where
    login_id = 'C1234'
    and user_password = '1234';

-- 1-3. 직원 정보 수정
-- 직원의 정보 수정
-- 직원은 자신의 비밀번호와 이메일, 핸드폰만 수정이 가능하다.
update users
set
    user_password='1235',
    email='dada@company.com',
    phone='010-1234-5679',
    img='https://i.imgur.com/NBEIFBz.png'
where login_id = 'C1234';

-- 1-4. 관리자의 직원 정보 수정
-- 관리자는 직원의 아이디, 비밀번호, 이메일, 핸드폰, 직급, 이름, 이메일을 다 수정할 수 있다.
update users
set
    login_id = 'C2345',
    user_password = '2345',
    email='dada@company.com',
    phone='010-1234-5679',
    position='부장',
    email='badadad1234@gmail.com'
where login_id = 'C1234';

-- 1-5. 직원 삭제
-- 직원을 삭제한다.
-- 삭제 되더라도 데이터베이스상에서는 기록이 남는다.
update users
set
    is_deleted = 1
where users.login_id = 'C2345';

-- 1-5 직원 삭제 취소
-- 삭제된 직원을 삭제되기 이전으로 되돌린다.
update users
set
    is_deleted = 0
where users.login_id = 'C2345';

-- 1-6 직원 조회
-- 전체 직원 조회
select login_id, user_password, name, email, position, phone, img
from users;
-- 특정 직원 조회
select *
from users
where login_id='C2345';


-- 2. 근태 신청 CRUD

-- 2-1 근태 신청하기
-- 제목, 내용, 근태 시작일, 근태 기간, 근태 타입 입력이 필요
insert into
    attendance(user_id, title, content, attendance_start_date, attendance_days, attendance_type)
values
    ((select u.id from users u where u.login_id = 'C2345'),
       '근태신청합니다',
       '친정어머니 생신으로 연차 신청합니다.',
        '2024-04-06',
       1,
       '연차');

-- 2-2 근태 신청 내역 조회
-- 직원 전체 근태 신청 내역 조회
-- 근태 신청 번호, 직원 이름, 직원 아이디, 직원 신청 내역(제목, 내용, 근태기간, 근태 타입, 등)이 조회됨.
select
    a.id, u.login_id, u.name, title, content, attendance_start_date, attendance_days, attendance_type, attendance_apply_time
from
    attendance a, users u
where a.user_id = u.id;

-- 2-2 근태 신청 내역 조회 - 필터 기능
-- 근태 타입(연차, 반차, 조퇴, 기타)를 선택해 해당 근태 타입으로 조회가 가능함.
select
    a.id, u.login_id, u.name, title, content, attendance_start_date, attendance_days, attendance_type, attendance_apply_time
from
    attendance a, users u
where a.user_id = u.id and a.attendance_type = '연차';

-- 2-2 근태 신청 내역 조회 - 직원 이름 검색
-- 직원 이름으로 근태 내역 조회가 가능함.
select *
from attendance;


-- 2-3 근태 신청 내역 수정
-- 직원 아이디를 이용해서 수정 가능
update attendance
set
    title = '근태를 신청해야 됩니다.',
    content = '제 생일이라 신청합니다.',
    attendance_start_date = '2023-08-05',
    attendance_type = '반차',
    attendance_days = 0.5
where user_id = (select user_id from users where login_id = 'C2345');


-- 2-4 근태 신청 내역 삭제
-- 근태 신청 내역 번호를 이용해서 삭제 가능함.
delete
from attendance
where id = 1;


-- 3. 관리자 계정 CRUD

-- 3-1. 관리자 계정 생성
-- 관리자 아이디, 관리자 비밀번호, 직원 아이디, 이름를 넣어서 생성 가능함.
insert into
    administrator(login_id, administrator_password, user_id, name)
    values ('K1234','1q2w3e4r',(select users.id from users where users.login_id = 'C2345'), '고낙연');

insert into
    administrator(login_id, administrator_password, name)
    values ('K1235', '1q2w3e4r5t', '김낙연');

insert into
    administrator(login_id, administrator_password, name)
    values ('K1238', '1q2w3e4r5t', '김낙연');

-- 3-2. 관리자 계정 조회
select *
from administrator;

select *
from administrator
where login_id = 'K1234';

-- 3-3. 관리자 계정 수정
update administrator
set
    login_id= 'K3456',
    administrator_password = '123455435',
    name = '오낙연'
where login_id = 'K1234';


-- 3-4. 관리자 계정 삭제
delete
from administrator
where login_id = 'K1234';


-- 4. 근무 시간 관리

-- 4-1. 출근 시간 갱신

-- 만약, 출근 시간 기록부에 c1234 아이디의 직원의 출근 기록이 있고 퇴근 기록이 없다면
-- 출근 기록을 갱신 하지 않는다.

-- 출근 기록이 없다면 또는 출근 기록이 있으나 퇴근기록도 존재한다면 출근 기록을 갱신한다.

select time_punch.id, user_id, punch_in, punch_out
from time_punch
where
    user_id = (select user_id from users where login_id = 'C2345')
  and punch_out is null;


insert into time_punch(user_id, punch_in, punch_out)
values (
        (select users.id from users where login_id = 'C2345'),
        datetime('now',  '+9 hours' ),
        null
       );

select *
from time_punch;
select *
from users;

-- 4-2. 퇴근 시간 갱신
-- 출근 시간이 있는 경우에만 퇴근 시간을 갱신한다.
update time_punch
set
    punch_out  = datetime('now','+9 hours')
where
    user_id = (select user_id from users where login_id = 'C2345')
  and punch_out is null;



-- 4-3. 출근 시간 갱신 취소

-- 출근 시간 갱신 내역을 확인하고나서, 특정 출근 시간 갱신을 취소 할 수 있음.
select
    time_punch.id,
    punch_in,
    punch_out
from time_punch
where
    user_id = (select users.id from users where users.login_id = 'C2345');

delete
from time_punch
where time_punch.id = 1;


-- 4-4. 퇴근 시간 갱신 취소

-- 출근 시간 갱신 내역을 확인하고나서, 특정 퇴근 시간 갱신을 취소 할 수 있음.
select
    time_punch.id,
    punch_in,
    punch_out
from time_punch
where
    user_id = (select users.id from users where users.login_id = 'C2345');

delete
from time_punch
where time_punch.id = 2;



-- 4-5. 출근 시간 수정
-- 출근 시간 내역 확인 후, 특정 출근 시간 내역을 수정 할 수 있음.

select
    time_punch.id,
    punch_in,
    punch_out
from time_punch
where
    user_id = (select users.id from users where login_id = 'C2345');

update time_punch
set
    punch_in = datetime('now','+9 hours')
where time_punch.id = 1;

-- 4-6. 퇴근 시간 수정
-- 퇴근 시간 내역 확인 후, 특정 퇴근 시간 내역을 수정 할 수 있음.
select
    time_punch.id,
    punch_in,
    punch_out
from time_punch
where
    user_id = (select users.id from users where login_id = 'C2345');

update time_punch
set
    punch_out = datetime('now','+9 hours')
where time_punch.id = 1;


-- 5. 기업 갤러리 CRUD

-- 5-1 갤러리 글 갱신
insert into company_gallery(
            administrator_id,
            title,
            content,
            img)
    values(
           (select administrator.id from administrator where administrator.login_id = 'K1235'),
           '여름 합숙 연수',
           '~연수 했던 내용~',
           'https://i.imgur.com/2Vmid1P.jpeg'
          );

-- 5-1 갤러리 글 조회
select
    a.login_id,
    title,
    content,
    img
from company_gallery c, administrator a
where c.id = a.id;

-- 5-2 갤러리 특정 글 조회
select
    a.login_id,
    title,
    content,
    img
from company_gallery c, administrator a
where c.id = a.id
and c.id = 1;

-- 5-3 갤러리 글 수정
-- 자기가 작성한 글만 수정 가능함.
-- 관리자 계정을 가지고 있는 경우 글 수정 가능함.
update company_gallery
set
    title = '겨울 합숙 연수',
    content = '겨울 합숙 연수 내용 설명',
    img='https://i.imgur.com/3R9iaYo.jpeg'
where company_gallery.id = 1
and administrator_id = (select administrator.id from administrator where login_id = 'K1234');

-- 5-4 갤러리 글 삭제
delete from company_gallery
where company_gallery.id =1;

select *
from company_gallery;



----- 연습용, 테스트용
select *
from time_punch
where time_punch.id = 1;
select *
from time_punch;
select *
from users;

select users.id from users where login_id = 'C1234';

select administrator.id from administrator where login_id = 'K1234';

select *
from administrator;

delete
from time_punch;
```
