declare namespace NodeJS {
interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    REACT_APP_IP_ADDRESS: string
    }
}
interface Window {
    Stripe: any
}
