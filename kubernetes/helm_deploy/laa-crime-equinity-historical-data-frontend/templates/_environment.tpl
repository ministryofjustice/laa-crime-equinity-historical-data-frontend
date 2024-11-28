{{/*
Environment variables for service containers
*/}}
{{- define "laa-crime-equinity-historical-data-frontend.env-vars" }}
env:
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
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: EQ_API_URL
  - name: CRM_API_CACHE_MAX
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: CRM_API_CACHE_MAX
  - name: CRM_API_CACHE_TTL
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: CRM_API_CACHE_TTL
  - name: SDS_AUTH_SCOPE
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: SDS_AUTH_SCOPE
  - name: SDS_API_URL
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: SDS_API_URL
  - name: SDS_AUTH_CACHE_MAX
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: SDS_AUTH_CACHE_MAX
  - name: SDS_AUTH_CACHE_TTL
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: SDS_AUTH_CACHE_TTL
  - name: REDIS_ENABLED
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: REDIS_ENABLED
  - name: REDIS_TLS_ENABLED
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: REDIS_TLS_ENABLED
  - name: REDIS_HOST
    valueFrom:
      secretKeyRef:
        name: elasticache-redis
        key: primary_endpoint_address
  - name: REDIS_AUTH_TOKEN
    valueFrom:
      secretKeyRef:
        name: elasticache-redis
        key: auth_token
  - name: CLOUD_INSTANCE
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: CLOUD_INSTANCE
  - name: TENANT_ID
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: TENANT_ID
  - name: CLIENT_ID
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: CLIENT_ID
  - name: CLIENT_SECRET
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: CLIENT_SECRET
  - name: REDIRECT_URI
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: REDIRECT_URI
  - name: POST_LOGOUT_REDIRECT_URI
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: POST_LOGOUT_REDIRECT_URI
  - name: EXPRESS_SESSION_SECRET
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: EXPRESS_SESSION_SECRET
  - name: ALLOWED_USER_PROFILE_GROUPS
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: ALLOWED_USER_PROFILE_GROUPS
  - name: REPORTING_USER_PROFILE_GROUP
    valueFrom:
      secretKeyRef:
        name: appsecret
        key: REPORTING_USER_PROFILE_GROUP
  - name: HOST_ENV
    value: {{ .Values.service.environment }}

{{/*TODO (EMP-692): remove K8 secret stored for environment name and delete commented code below*/}}
{{/*  - name: ENVIRONMENT_NAME*/}}
{{/*    valueFrom:*/}}
{{/*    secretKeyRef:*/}}
{{/*      name: appsecret*/}}
{{/*      key: ENVIRONMENT_NAME*/}}
{{- end -}}