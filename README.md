# realxtest_test_propose
test propose

NOTE Backend use node v20.13.1 สำหรับ env-file feature,  frontend use v16.20.2

video สำหรับการรันทดสอบใน local
https://drive.google.com/file/d/1KvSBIO8rQ88SzYY4EyipHxrX-iR4khAV/view?usp=sharing



สำหรับการ build docker images ของ backend และ frontend นั้นจะแสดงใน cmd.txt

```
//สำหรับรัน db  เพื่อทดสอบในเครื่องตัวเอง
1.docker compose -f docker-compose.yml down && docker compose -f docker-compose.yml up   


//สำหรับ build image และ รัน image frontend 
*** ใน code ของ frontend ผม fix  const baseUrl:string = "http://127.0.0.1:3000" สำหรับ API ในความจริงควร process.env['URL'] โดย env นี้จะ pass ผ่าน vault หรือ helm chart แล้วแต่ DEVOPS
1.docker build -t frontendvite:demo .
2.docker run --rm  -p 3001:80 frontendvite:demo




//สำหรับ build image และ รัน image backend 
**ใน backend ผมใช้ .env ฉนั้นหากรันก็จะไม่สามรถเจอ db ได้ เพราะอยู่นอก container ใช้สำหรับ  dev โดย env ใน prd นี้จะ pass ผ่าน vault หรือ helm chart แล้วแต่ DEVOPS แทน
1.docker build -t backendts:demo .
2.docker run --rm  -p 3000:3000 backendts:demo


```
