import {h, Component} from 'preact';

export default class Footer extends Component {
    /**
     * Preact render function
     *
     * @returns {*}
     */
    render() {
        return (
            <div className="max-w-screen-xl p-4 mx-auto mt-4 text-gray-200 border-t border-gray-800 md:px-8">
                <div className="grid md:grid-rows-3 md:grid-cols-3 md:grid-flow-col">
                    <span className="py-3 md:py-0 md:pb-4">
                        <a href="/">Home</a>
                    </span>
                    <span className="py-3 md:py-0 md:pb-4">
                        <a href="">About</a>
                    </span>
                    <span className="py-3 md:py-0 md:pb-4">
                        <a href="">Terms of use</a>
                    </span>
                    <span className="py-3 md:py-0 md:pb-4">
                        <a href="">Shipping &amp; Returns</a>
                    </span>
                    <span className="py-3 md:py-0 md:pb-4">
                        <a href="/">Privacy Policy</a>
                    </span>
                </div>
                <div className="flex flex-col items-center justify-between pt-6 pb-10 space-y-4 text-sm md:flex-row text-accent-6">
                    <div>
                        <span>© {new Date().getFullYear()} ACME, Inc. All rights reserved.</span>
                    </div>
                </div>
            </div>
        );
    }
}