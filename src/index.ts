import cluster from 'cluster'
import express from 'express'

// Master process listens on a port, accepts new connections and distributes them across
// the workers in a round-robin fashion
if (cluster.isMaster) {
  const cpuCount: number = require('os').cpus().length

  // This for loop works because when i reaches zero the iterating condition is coerced to false
  // and we quit the loop. Of course this is only useful if you’re ok iterating in
  // reverse sequence.
  for (let i = cpuCount; i--;) {
    cluster.fork()
  }
} else {
  const app = express()
  app.use(express.json())
  // Use routes file for handling requests to /api
  app.use('/api', require('./routes/routes'))
  app.listen(5050)
}

// cluster worker exit event
// On exit, log worker id and fork new worker
cluster.on('exit', (worker: cluster.Worker) => {
  console.log('Worker ' + worker.id + ' no longer exists')
  cluster.fork()
})
