export interface IError {
	message: string;
	statusCode: number;
	status: string;
}

export abstract class CustomError extends Error {}

// Pricipio SOLID: Resposabilidad unica
