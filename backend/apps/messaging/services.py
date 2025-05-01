def send_fcm_to_patient(patient_id, body, title):
    print(f"[모의 FCM] 푸시 알림 전송")
    print(f"  ▷ 대상 환자 ID: {patient_id}")
    print(f"  ▷ 제목: {title}")
    print(f"  ▷ 내용: {body}")