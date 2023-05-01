import { type Request, type Response, type Router } from 'express';

export default (router: Router): void => {
	router.post('/api/login/facebook', (req: Request, res: Response) => {
		res.send({ data: 'any_data' });
	});
};
