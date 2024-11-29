{{/*
Environment variables for service containers
*/}}
{{- define "laa-crime-equinity-historical-data-frontend.env-vars" }}
env:
  - name: CACHE_CRM_API_MAX
    value: {{ .Values.env.CACHE_CRM_API_MAX | quote }}
  - name: CACHE_CRM_API_TTL
    value: {{ .Values.env.CACHE_CRM_API_TTL | quote }}
  - name: CACHE_SDS_AUTH_MAX
    value: {{ .Values.env.CACHE_SDS_AUTH_MAX | quote }}
  - name: CACHE_SDS_AUTH_TTL
    value: {{ .Values.env.CACHE_SDS_AUTH_TTL | quote }}
  - name: ENVIRONMENT_NAME
    value: {{ .Values.service.environment }}
  - name: EQ_API_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: EQ_API_CLIENT_ID
  - name: EQ_API_SECRET
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: EQ_API_SECRET
  - name: EQ_API_URL
    value: {{ .Values.env.EQ_API_URL | quote }}
  - name: REDIS_AUTH_TOKEN
    valueFrom:
      secretKeyRef:
        name: elasticache-redis
        key: auth_token
  - name: REDIS_ENABLED
    value: {{ .Values.env.REDIS_ENABLED | quote }}
  - name: REDIS_HOST
    valueFrom:
      secretKeyRef:
        name: elasticache-redis
        key: primary_endpoint_address
  - name: REDIS_TLS_ENABLED
    value: {{ .Values.env.REDIS_TLS_ENABLED | quote }}
  - name: SESSION_SECRET
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: EXPRESS_SESSION_SECRET
  - name: SDS_API_URL
    value: {{ .Values.env.SDS_API_URL | quote }}
  - name: SDS_AUTH_SCOPE
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: SDS_AUTH_SCOPE
  - name: SSO_ALLOWED_USER_PROFILE_GROUPS
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: ALLOWED_USER_PROFILE_GROUPS
  - name: SSO_CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: CLIENT_ID
  - name: SSO_CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: CLIENT_SECRET
  - name: SSO_CLOUD_INSTANCE
    value: {{ .Values.env.SSO_CLOUD_INSTANCE | quote }}
  - name: SSO_POST_LOGOUT_REDIRECT_URI
    value: {{ .Values.env.SSO_POST_LOGOUT_REDIRECT_URI | quote }}
  - name: SSO_REDIRECT_URI
    value: {{ .Values.env.SSO_REDIRECT_URI | quote }}
  - name: SSO_REPORTING_USER_PROFILE_GROUP
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: REPORTING_USER_PROFILE_GROUP
  - name: SSO_TENANT_ID
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: TENANT_ID
{{- end -}}
