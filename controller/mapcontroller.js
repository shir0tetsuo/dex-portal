exports.test_export = async function(req, res) {
  res.status(501).send('NOT IMPLEMENTED')
}

exports.test_view = async function(req, res, M, Users) {

  const { id } = req.params;

  var error = '';
  if (!M) error += 'NO-M,'
  if (!Users) error += 'NO-USERS,'
  res.status(200).send({
    error: error,
    request: id
  })
}
