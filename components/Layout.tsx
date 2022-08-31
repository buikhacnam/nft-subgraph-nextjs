import HeroComponent from './HeroComponent'

const Layout = ({ children }: any) => {
    return (
        <>
            <HeroComponent />
            <main>{children}</main>
        </>
    )
}

export default Layout
