{{/*
Expand the name of the chart.
*/}}
{{- define "laa-crime-equinity-historical-data-frontend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "laa-crime-equinity-historical-data-frontend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "laa-crime-equinity-historical-data-frontend.labels" -}}
helm.sh/chart: {{ include "laa-crime-equinity-historical-data-frontend.chart" . }}
{{ include "laa-crime-equinity-historical-data-frontend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}


{{/*
Selector labels
*/}}
{{- define "laa-crime-equinity-historical-data-frontend.selectorLabels" -}}
app: {{ .Chart.Name }}
app.kubernetes.io/metadata.name: "{{ .Chart.Name }}-{{ .Values.service.environment }}"
app.kubernetes.io/name: {{ include "laa-crime-equinity-historical-data-frontend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}



