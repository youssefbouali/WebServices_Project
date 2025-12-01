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

    stage('Tests') {
      parallel {
        stage('Profile Tests') {
          steps {
            bat 'cd profile && npm ci && npm test -- --ci'
          }
        }
        stage('SuiviTraitement Tests') {
          steps {
            bat 'mvn -B -f suivitraitement\\pom.xml clean test'
          }
          post {
            always {
              junit 'suivitraitement/target/surefire-reports/*.xml'
            }
          }
        }
        stage('Planification Tests') {
          steps {
            bat 'mvn -B -f planification\\pom.xml clean test'
          }
          post {
            always {
              junit 'planification/target/surefire-reports/*.xml'
            }
          }
        }
      }
    }

    stage('Build Artifacts') {
      parallel {
        stage('Build SuiviTraitement Jar') {
          steps {
            bat 'mvn -B -f suivitraitement\\pom.xml -DskipTests package'
          }
          post {
            success {
              archiveArtifacts artifacts: 'suivitraitement/target/*.jar', fingerprint: true
            }
          }
        }
        stage('Build Planification Jar') {
          steps {
            bat 'mvn -B -f planification\\pom.xml -DskipTests package'
          }
          post {
            success {
              archiveArtifacts artifacts: 'planification/target/*.jar', fingerprint: true
            }
          }
        }
        stage('Build Profile') {
          steps {
            bat 'cd profile && npm ci && npm run build'
          }
          post {
            success {
              archiveArtifacts artifacts: 'profile/dist/**', fingerprint: true
            }
          }
        }
      }
    }

    stage('Build Docker Images') {
      parallel {
        stage('SuiviTraitement Image') {
          steps {
            bat 'docker build -t healthtrack/suivitraitement:latest ./suivitraitement'
          }
        }
        stage('Frontend Image') {
          steps {
            bat 'docker build -t healthtrack/frontend:latest ./frontend'
          }
        }
        stage('Device Image') {
          steps {
            bat 'docker build -t healthtrack/device:latest ./device'
          }
        }
      }
    }

    stage('Deploy Compose') {
      when {
        expression { return DEPLOY == 'true' }
      }
      steps {
        bat 'docker compose -f docker-compose.yml up -d'
      }
    }
  }

  post {
    always {
      cleanWs()
    }
  }
}
