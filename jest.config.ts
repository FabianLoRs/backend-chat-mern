import type { Config } from '@jest/types';

const config: Config .InitialOptions = {

	preset: 'ts-jest', // Definir el interprete de los test de jest con .ts para jest
	testEnvironment: 'node', // Me permite habilitar el reconocimiento de jset para Node
	verbose: true,  // Me permite visualizar los detalles que te entregan los test: ya sean exitosos o no exitosos
	coverageDirectory: 'coverage', // Me permite habilitar un directorio de reporte de cobertura de test
	collectCoverage: false, // Me permite habilitar un inspector de covertura de test por la terminal que me entrega el resultado del % cobierto como tabla de resumen del 100%, esto si pongo true. Si es false se resuleven los test, pero no aparece la tablaresumne del coverage
	testPathIgnorePatterns: ['/node_modules'], // Me permite ingnorar directorios que no formen parte del ecosistema de test
	transform: { // Me permite ejecutar mis archivos de test con .ts mediante el preset de ts-jest
		'^.+\\.ts?$': 'ts-jest'
	},
	testMatch: ['<rootDir>/src/**/test/*.ts'], // Me permite definir donde se van a ir a leer los test, en que directorio.
	// OJO!
	collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**'], // Me permite definir a partir de que directorio voy a ir capturar la cobertura de test.
	coverageThreshold: { // Me permite agregar los umbrales de verificacion para la cobertura de test
		global: {
			branches: 1, // Esto se refiere a los diferentes ramales en el flujo de control de mi codigo. Por ej: una sentencia if/else
			functions: 1, // Esto se refiere a la definicion de las funciones que se habn definido en mi código.
			lines: 1, // Esto se refiere a las lineas individuales de tú código.
			statements: 1 //Esto se refiere a cualquier sentencia de ejecución en el código. Por ej: asignaciones, instruccion de salida, llamada a una funcion, etc..
		}
	},
	coverageReporters: ['text-summary', 'lcov'], // Me permite generar un resumen en texto de la cobertura de text.
	moduleNameMapper: { // Mapeador de identificación de los directorios que disponibilizaremos para trabajar con jest.
		'@bootstrap/(.*)': ['<rootdir>/src/bootstrap/$1'],
		'@configs/(.*)': ['<rootdir>/src/configs/$1'],
		'@auth/(.*)': ['<rootdir>/src/features/auth/$1'],
		'@user/(.*)': ['<rootdir>/src/features/user/$1'],
		'@interfaces/(.*)': ['<rootdir>/src/interfaces/$1'],
		'@decorators/(.*)': ['<rootdir>/src/shared/globals/decorators$1'],
		'@helpers/(.*)': ['<rootdir>/src/shared/globals/helpers$1'],
		'@services/(.*)': ['<rootdir>/src/shared/globals/services$1'],
		'@sockets/(.*)': ['<rootdir>/src/shared/globals/sockets$1'],
		'@workers/(.*)': ['<rootdir>/src/shared/globals/workers$1'],
		'@root/(.*)': ['<rootdir>/src/$1'],
	},
};

export default config;
