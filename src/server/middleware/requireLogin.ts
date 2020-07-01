const requireLogin = (req: any, res: any, next: any) => {
  if (!req.user) {
    if (req &&
        req.body &&
        req.body.query &&
        (req.body.query.includes('mutation') && !req.body.query.includes('addPeakList'))
      ) {
      return res.status(401).send({error: 'You must login'});
    } else {
      next();
    }
  } else {
    next();
  }
};

export default requireLogin;
