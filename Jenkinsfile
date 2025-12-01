pipeline {
  agent any

  environment {
    MAVEN_OPTS = '-Dmaven.repo.local=.m2/repository'
    DEPLOY = env.DEPLOY ?: 'false'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Test SuiviTraitement') {
      steps {
        sh 'mvn -B -f suivitraitement/pom.xml clean test'
      }
      post {
        always {
          junit 'suivitraitement/target/surefire-reports/*.xml'
        }
      }
    }

    stage('Build Jar') {
      steps {
        sh 'mvn -B -f suivitraitement/pom.xml -DskipTests package'
      }
      post {
        success {
          archiveArtifacts artifacts: 'suivitraitement/target/*.jar', fingerprint: true
        }
      }
    }

    stage('Build Docker Image') {
      steps {
        sh 'docker build -t healthtrack/suivitraitement:latest ./suivitraitement'
      }
    }

    stage('Deploy (Compose)') {
      when {
        expression { return DEPLOY == 'true' }
      }
      steps {
        sh 'docker compose -f docker-compose.yml up -d postgres suivitraitement_service'
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}

