interface APIResponse<T=any> {
    data: T
    messages: string[]
}

export default APIResponse;