<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @Doctrine/Collector/explain.html.twig */
class __TwigTemplate_4c54588b69eae50fd2582b71e38c741c extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "@Doctrine/Collector/explain.html.twig"));

        // line 1
        if ((Twig\Extension\CoreExtension::length($this->env->getCharset(), CoreExtension::getAttribute($this->env, $this->source, (isset($context["data"]) || array_key_exists("data", $context) ? $context["data"] : (function () { throw new RuntimeError('Variable "data" does not exist.', 1, $this->source); })()), 0, [], "array", false, false, false, 1)) > 1)) {
            // line 2
            yield "    ";
            // line 3
            yield "    <table style=\"margin: 5px 0;\">
        <thead>
            <tr>
                ";
            // line 6
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable(Twig\Extension\CoreExtension::keys(CoreExtension::getAttribute($this->env, $this->source, (isset($context["data"]) || array_key_exists("data", $context) ? $context["data"] : (function () { throw new RuntimeError('Variable "data" does not exist.', 6, $this->source); })()), 0, [], "array", false, false, false, 6)));
            foreach ($context['_seq'] as $context["_key"] => $context["label"]) {
                // line 7
                yield "                    <th>";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($context["label"], "html", null, true);
                yield "</th>
                ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['label'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 9
            yield "            </tr>
        </thead>
        <tbody>
            ";
            // line 12
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable((isset($context["data"]) || array_key_exists("data", $context) ? $context["data"] : (function () { throw new RuntimeError('Variable "data" does not exist.', 12, $this->source); })()));
            foreach ($context['_seq'] as $context["_key"] => $context["row"]) {
                // line 13
                yield "            <tr>
                ";
                // line 14
                $context['_parent'] = $context;
                $context['_seq'] = CoreExtension::ensureTraversable($context["row"]);
                foreach ($context['_seq'] as $context["key"] => $context["item"]) {
                    // line 15
                    yield "                    <td>";
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::replace($context["item"], ["," => ", "]), "html", null, true);
                    yield "</td>
                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['key'], $context['item'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 17
                yield "            </tr>
            ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['row'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 19
            yield "        </tbody>
    </table>
";
        } else {
            // line 22
            yield "    ";
            // line 23
            yield "    <pre style=\"margin: 5px 0;\">";
            // line 24
            $context['_parent'] = $context;
            $context['_seq'] = CoreExtension::ensureTraversable((isset($context["data"]) || array_key_exists("data", $context) ? $context["data"] : (function () { throw new RuntimeError('Variable "data" does not exist.', 24, $this->source); })()));
            foreach ($context['_seq'] as $context["_key"] => $context["row"]) {
                // line 25
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::first($this->env->getCharset(), $context["row"]), "html", null, true);
                yield "
";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['row'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 27
            yield "</pre>
";
        }
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "@Doctrine/Collector/explain.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable()
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  116 => 27,  108 => 25,  104 => 24,  102 => 23,  100 => 22,  95 => 19,  88 => 17,  79 => 15,  75 => 14,  72 => 13,  68 => 12,  63 => 9,  54 => 7,  50 => 6,  45 => 3,  43 => 2,  41 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("{% if data[0]|length > 1 %}
    {# The platform returns a table for the explanation (e.g. MySQL), display all columns #}
    <table style=\"margin: 5px 0;\">
        <thead>
            <tr>
                {% for label in data[0]|keys %}
                    <th>{{ label }}</th>
                {% endfor %}
            </tr>
        </thead>
        <tbody>
            {% for row in data %}
            <tr>
                {% for key, item in row %}
                    <td>{{ item|replace({',': ', '}) }}</td>
                {% endfor %}
            </tr>
            {% endfor %}
        </tbody>
    </table>
{% else %}
    {# The Platform returns a single column for a textual explanation (e.g. PostgreSQL), display all lines #}
    <pre style=\"margin: 5px 0;\">
        {%- for row in data -%}
            {{ row|first }}{{ \"\\n\" }}
        {%- endfor -%}
    </pre>
{% endif %}
", "@Doctrine/Collector/explain.html.twig", "/var/www/symfony_docker/vendor/doctrine/doctrine-bundle/templates/Collector/explain.html.twig");
    }
}
