pipeline {
    agent any
    
    environment {
        // Define environment variables if needed
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Checkout code from version control
                checkout scm
            }
        }
        
        stage('Stop Existing Containers') {
            steps {
                script {
                    try {
                        bat 'docker-compose down'
                    } catch (Exception e) {
                        echo 'No containers were running'
                    }
                }
            }
        }
        
        stage('Build and Start Containers') {
            steps {
                script {
                    // Build and start containers using docker-compose
                    bat 'docker-compose up --build -d'
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    // Wait for services to be ready
                    sleep(time: 30, unit: 'SECONDS')
                    
                    // Check if services are running
                    bat 'docker-compose ps'
                    
                    // Test backend API endpoint
                    bat 'curl -f http://localhost:5000/quote || exit 1'
                }
            }
        }
    }
    
    post {
        failure {
            script {
                // Clean up containers if build fails
                bat 'docker-compose down'
            }
        }
    }
}