import withTimeout from '../utility/withTimeout';
import Alert from './Alert';

export default withTimeout({
  timeoutMs: 5000,
  onTimeout: ({ close }) => close()
})(Alert);
