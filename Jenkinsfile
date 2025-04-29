pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Free up Port 5000') {
            steps {
                bat '''
                FOR /F "tokens=5" %%A IN ('netstat -aon ^| findstr :5000') DO (
                    echo Killing process using port 5000
                    taskkill /F /PID %%A
                )
                '''
            }
        }

        stage('Verify Docker is Running') {
            steps {
                bat '''
                docker info > nul 2>&1
                if %ERRORLEVEL% NEQ 0 (
                    echo Docker is not running!
                    exit /b 1
                ) else (
                    echo Docker is running.
                )
                '''
            }
        }

        stage('Stop Existing Containers') {
            steps {
                script {
                    try {
                        bat "docker-compose -f %DOCKER_COMPOSE_FILE% down"
                    } catch (Exception e) {
                        echo 'No containers were running'
                    }
                }
            }
        }

        stage('Build and Start Containers') {
            steps {
                script {
                    bat "docker-compose -f %DOCKER_COMPOSE_FILE% up --build -d"
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sleep(time: 30, unit: 'SECONDS')
                    bat "docker-compose -f %DOCKER_COMPOSE_FILE% ps"
                    bat '''
                    curl -f http://localhost:5000/quote || (
                        echo Backend health check failed!
                        exit /b 1
                    )
                    '''
                }
            }
        }
    }

    post {
        failure {
            script {
                echo 'Build failed. Cleaning up containers...'
                bat "docker-compose -f %DOCKER_COMPOSE_FILE% down"
            }
        }
    }
}
