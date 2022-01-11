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

export default config;
