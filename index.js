// Wrap a stream in starting and ending strings/bytes

var through = require('through2')

module.exports = wrap

function wrap(prefix, suffix) {
  var firstChunkTransformed = false
    , prefix = new Buffer(prefix)
    , suffix = new Buffer(suffix || prefix)
    , previousChunk

  return through(transform, flush)

  function transform(chunk, enc, cb) {
    if (previousChunk) this.push(previousChunk)
    previousChunk = firstChunkTransformed ? chunk : Buffer.concat([prefix, chunk])
    firstChunkTransformed = true
    cb()
  }

  function flush(cb) {
    this.push(Buffer.concat([previousChunk, suffix]))
    cb()
  }
}

// ---

// e.g.
//    echo -n abc | node wrap-stream X X #=> XabcX
var runWithStdin = !module.parent
if (runWithStdin) {
  var head = process.argv[2]
    , tail = process.argv[3]
  process.stdin.pipe(wrap(head,tail)).pipe(process.stdout)
}
