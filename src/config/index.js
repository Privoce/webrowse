/**
 * @author: laoona
 * @date:  2022-01-09
 * @time: 19:53
 * @contact: laoona.com
 * @description: #
 */

import dev from './dev';
import prod from './prod';

const env = process.env.NODE_ENV;
const config = env === 'development' ? dev : prod;

console.log(config, 'NODE_ENV');
export default config;
