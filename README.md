< 실시 : 깃허브에 있는 호진님 브랜치에 정우님 backend 적용해보기 >

[ 실시한 것 ]
- 16:01 = 정우님 backend 폴더를 호진님 backend랑 바꿈 
 
<현재 가능 기능>
- 회원가입 / 로그인 
- 간호사 페이지에서 의사 대시보드로 환자 업로드
- 환자 등록(Front -> backend 연동)

<현재 해결해야하는 문제>
- 의사 페이지에서 새로고침 하면 간호사 대시보드로 넘어감
- 간호사 페이지 바이탈 입력 후 저장 안 됌
- 메시지(간호사/의사) - 화면 조차 안 뜸


<NurseDashboard.tsx 오류 5가지>
✅ 1. @mui/material/Unstable_Grid2 모듈 불일치 오류
에러 메시지: Cannot find module '@mui/material/Unstable_Grid2'

원인: 해당 모듈은 MUI v5의 베타 기능이며 설치되지 않았거나 버전 불일치.

해결: Unstable_Grid2 대신 정식 컴포넌트 Grid 사용 권장 (@mui/material/Grid).

✅ 2. Grid 내 item, xs 등 속성 타입 오류
에러 메시지: Property 'item' does not exist on type ..., No overload matches this call

원인: <Grid xs={12}>와 같이 item이 누락되었거나 타입이 불일치.

해결: 항상 <Grid item xs={12}> 형태로 사용해야 함.

✅ 3. step 속성 오류
에러 메시지: Property 'step' does not exist on type 'IntrinsicAttributes & TextFieldProps'

원인: MUI TextField에서 type="number"일 때 step 속성은 명시적으로 허용되지 않음 (타입스크립트 정의 상).

해결: <TextField inputProps={{ step: '0.1' }} /> 형식으로 전달해야 함.

✅ 4. npm start 실행 오류
에러 메시지: Missing script: "start"

원인: package.json 내 "scripts"에 "start" 명령이 정의되지 않음.

해결: React 프로젝트는 npm run dev (Vite 기반)로 실행해야 함.

✅ 5. 400 Bad Request (Axios 요청 실패)
에러 메시지: Request failed with status code 400

원인:
프론트에서 전송하는 필드명(patient, systolic_bp, 등)과 백엔드 모델이 불일치하거나
백엔드에서 해당 환자 ID(patient)가 존재하지 않아 ForeignKey 유효성 검증 실패

해결:
백엔드에서 Patient 객체가 실제 존재하는지 확인
프론트에서 patient 필드에 반드시 존재하는 정수 ID를 넘겨야 함

<간호사 대시보드 굴러가는 구조>
1. 환자 (이름 / 성별 / 생일 /
2. vital 입력 ( * 이때 저장 버튼 누르면 오류 발생 )
